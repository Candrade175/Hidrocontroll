using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using hidrocontroll.Models;

namespace hidrocontroll.Controllers
{
    public class UmidadeController : BaseController
    {

        // GET api/Umidade
        public IQueryable<CAD_UMIDADE> GetCAD_UMIDADE()
        {
            return db.CAD_UMIDADE;
        }

        // GET api/Umidade/5
        [ResponseType(typeof(CAD_UMIDADE))]
        public IHttpActionResult GetCAD_UMIDADE(int id)
        {
            CAD_UMIDADE cad_umidade = db.CAD_UMIDADE.Find(id);
            if (cad_umidade == null)
            {
                return NotFound();
            }

            return Ok(cad_umidade);
        }

        // PUT api/Umidade/5
        public IHttpActionResult PutCAD_UMIDADE(int id, CAD_UMIDADE cad_umidade)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cad_umidade.IDC_CAD_UMIDADE)
            {
                return BadRequest();
            }

            db.Entry(cad_umidade).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CAD_UMIDADEExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/Umidade
        [ResponseType(typeof(CAD_UMIDADE))]
        public IHttpActionResult PostCAD_UMIDADE(CAD_UMIDADE cad_umidade)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CAD_UMIDADE.Add(cad_umidade);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = cad_umidade.IDC_CAD_UMIDADE }, cad_umidade);
        }

        // DELETE api/Umidade/5
        [ResponseType(typeof(CAD_UMIDADE))]
        public IHttpActionResult DeleteCAD_UMIDADE(int id)
        {
            CAD_UMIDADE cad_umidade = db.CAD_UMIDADE.Find(id);
            if (cad_umidade == null)
            {
                return NotFound();
            }

            db.CAD_UMIDADE.Remove(cad_umidade);
            db.SaveChanges();

            return Ok(cad_umidade);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CAD_UMIDADEExists(int id)
        {
            return db.CAD_UMIDADE.Count(e => e.IDC_CAD_UMIDADE == id) > 0;
        }
    }
}